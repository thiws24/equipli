import { themeQuartz } from "ag-grid-community"

// to use myTheme in an application, pass it to the theme grid option
export const detailsTheme = themeQuartz.withParams({
    accentColor: "#F27428",
    backgroundColor: "#f3f4f6",
    browserColorScheme: "light",
    fontFamily: "inherit",
    headerFontSize: 14,
    headerFontWeight: 600,
    headerTextColor: "#ffffff",
    foregroundColor: "#0E0E0E",
    headerBackgroundColor: "#F27428",
    borderColor: "#0E0E0E00",
    oddRowBackgroundColor: "#F2E9D7",
    rowHeight: 40,
    headerHeight: 40,
})

export const inventoryTheme = themeQuartz.withParams({
    accentColor: "#F27428",
    backgroundColor: "#F2E9D7",
    browserColorScheme: "light",
    fontFamily: "inherit",
    headerFontSize: 14,
    headerFontWeight: 600,
    headerTextColor: "#ffffff",
    foregroundColor: "#0E0E0E",
    headerBackgroundColor: "#F27428",
    borderColor: "#0E0E0E00",
    oddRowBackgroundColor: "#E6D8C4",
    rowHeight: 80
})
