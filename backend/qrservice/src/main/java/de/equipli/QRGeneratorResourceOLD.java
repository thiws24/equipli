package de.equipli;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

@ApplicationScoped
@Path("/qr")
public class QRGeneratorResourceOLD {

    private final String activeProfile;
    private final String devPngPath;
    private final String devPdfPath;
    private final String prodPngPath;
    private final String prodPdfPath;

    @Inject
    public QRGeneratorResourceOLD(
            @ConfigProperty(name = "quarkus.profile") String activeProfile,
            @ConfigProperty(name = "qrservice.dev.png.path") String devPngPath,
            @ConfigProperty(name = "qrservice.dev.pdf.path") String devPdfPath,
            @ConfigProperty(name = "qrservice.prod.png.path") String prodPngPath,
            @ConfigProperty(name = "qrservice.prod.pdf.path") String prodPdfPath) {
        this.activeProfile = activeProfile;
        this.devPngPath = devPngPath;
        this.devPdfPath = devPdfPath;
        this.prodPngPath = prodPngPath;
        this.prodPdfPath = prodPdfPath;
    }

    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response generateQR(QRInput qrInput) throws IOException {

        //Generate QR-Code
        String basePngPath = isProdProfile() ? prodPngPath : devPngPath;
        String basePdfPath = isProdProfile() ? prodPdfPath : devPdfPath;

        createDirectoryIfNotExists(basePngPath);
        createDirectoryIfNotExists(basePdfPath);

        String urn = qrInput.getUrn();
        String qrCodePngFilePath = basePngPath + "/qr_" + urn + ".png";
        String qrCodePdfFilePath = basePdfPath + "/qr_" + urn + ".pdf";

        QRCode.from(qrInput.getUrn()).to(ImageType.PNG).writeTo(new FileOutputStream(qrCodePngFilePath));

        //Creating PDF document object
        // Define page dimensions in centimeters
        double widthInMM = 50;
        double heightInMM = 50;
        float widthInPoints = (float) (widthInMM / 25.4 * 72);
        float heightInPoints = (float) (heightInMM / 25.4 * 72);

        // Create a new PDPage with custom dimensions
        PDPage page = new PDPage(new PDRectangle(widthInPoints, heightInPoints));

        // Add the custom page to the document
        PDDocument document = new PDDocument();
        document.addPage(page);

        PDImageXObject pdImage = PDImageXObject.createFromFile(qrCodePngFilePath, document);
        try (PDPageContentStream contentStream = new PDPageContentStream(document, document.getPage(0))) {
            contentStream.drawImage(pdImage, 0, 0, widthInPoints, heightInPoints);
        }

        //Saving the document
        File qrFile = new File(qrCodePdfFilePath);
        document.save(qrFile);

        //Closing the document
        document.close();

        FileInputStream fileInputStream = new FileInputStream(qrFile);

        return Response.ok().entity(fileInputStream).build();

    }

    private boolean isProdProfile() {
        return "prod".equals(activeProfile);
    }

    private void createDirectoryIfNotExists(String path) throws IOException {
        File dir = new File(path);
        if (!dir.exists()) {
            boolean dirCreated = dir.mkdirs();
            if (!dirCreated) {
                throw new IOException("Failed to create directory: " + dir.getAbsolutePath());
            }
        }
    }
}