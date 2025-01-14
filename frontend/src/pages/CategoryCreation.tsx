import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../components/ui/form"
import React from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useKeycloak } from "../keycloak/KeycloakProvider"
import { CustomToasts } from "../components/CustomToasts"
import { Plus } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"

const a = z.instanceof(File)

const CategoryCreationSchema = z.object({
    name: z.string().min(1),
    icon: z.string().optional(),
    description: z.string().optional(),
    image: z.instanceof(File).optional(),
    itemCount: z.number().min(1),
    itemLocation: z.string().optional()
})

type CategoryCreationType = z.infer<typeof CategoryCreationSchema>

function CategoryCreation() {
    const { userInfo, token } = useKeycloak()
    const navigate = useNavigate()
    const [count, setCount] = React.useState<string>()

    if (!userInfo?.groups?.includes("Inventory-Manager")) {
        window.open("/", "_self")
    }

    const form = useForm<CategoryCreationType>({
        resolver: zodResolver(CategoryCreationSchema)
    })

    const disableButton = () => {
        const values = form.getValues()
        return !values.name || !values.itemCount
    }

    async function onSubmit(values: CategoryCreationType) {
        const { image, ...rest } = values
        let photoUrl = null

        // First create category and then upload image
        try {
            const createRes = await fetch(
                `${import.meta.env.VITE_INVENTORY_SERVICE_HOST}/categories`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    method: "POST",
                    body: JSON.stringify({
                        photoUrl,
                        ...rest
                    })
                }
            )

            if (createRes.ok) {
                const data = await createRes.json()

                if (image) {
                    const formData = new FormData()
                    formData.append("fileContent", image)
                    formData.append("contentType", image.type)

                    await fetch(
                        `${import.meta.env.VITE_INVENTORY_SERVICE_HOST}/categories/${data.id}/image`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            body: formData
                        }
                    )
                }

                setTimeout(() => {
                    navigate(`/category/${data.id}`)
                }, 2000)

                CustomToasts.success({
                    message: "Erstellung erfolgreich!"
                })
            } else {
                CustomToasts.error({
                    message: "Fehler beim Erstellen der Kategorie."
                })
            }
        } catch (e) {
            CustomToasts.error({
                message: "Es ist ein Problem aufgetreten."
            })
            console.log(e)
        }
    }

    return (
        <Card className="w-11/12 sm:w-4/5 mx-auto my-5 md:my-10 lg:my-20 border-none drop-shadow-2xl">
            <CardHeader>
                <CardTitle>Inventarisierung</CardTitle>
                <CardDescription>
                    Erstelle eine neue Kategorie mit Items
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name*</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Beschreibung</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="sm:w-1/2">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({
                                    field: { value, onChange, ...field }
                                }) => (
                                    <FormItem>
                                        <FormLabel>Foto</FormLabel>
                                        <FormControl>
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    "file-upload"
                                                                )
                                                                ?.click()
                                                        }
                                                        className="text-white bg-customOrange hover:bg-customRed"
                                                    >
                                                        Bild hochladen
                                                    </Button>

                                                    <div className="text-sm text-gray-500 border rounded px-3 py-2 w-full">
                                                        {value
                                                            ? (value as File)
                                                                  .name
                                                            : "Keine Datei ausgewählt"}
                                                    </div>
                                                </div>

                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    style={{ display: "none" }}
                                                    onChange={(event) => {
                                                        if (event.target.files)
                                                            onChange(
                                                                event.target
                                                                    .files[0]
                                                            )
                                                    }}
                                                />
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col sm:flew-row gap-5 w-full">
                            <div className="w-full sm:w-1/2">
                                <FormField
                                    control={form.control}
                                    name="itemLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lagerort</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-[150px]">
                                <FormField
                                    control={form.control}
                                    name="itemCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Anzahl der Exemplare*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...form.register(
                                                        "itemCount",
                                                        { valueAsNumber: true }
                                                    )}
                                                    type="number"
                                                    {...field}
                                                    onChange={(event) => {
                                                        field.onChange(
                                                            event.target.value ? +event.target.value : event.target.value
                                                        )
                                                        setCount(event.target.value)
                                                    }
                                                }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-end">
                            <Button
                                disabled={disableButton() || !count}
                                type="submit"
                                className="text-customBeige bg-customOrange hover:bg-customRed"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Erstellen
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CategoryCreation
