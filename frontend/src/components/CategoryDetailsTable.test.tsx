import React from "react"
import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import CategoryDetailsTable from "./CategoryDetailsTable"
import { ColDef } from "ag-grid-community"
import { test, describe, expect, vi } from "vitest"
import { ItemProps } from "../interfaces/CategoryProps"

// Mock für useNavigate
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    }
})

const colDefs: ColDef<ItemProps, any>[] = [
    { field: "id", headerName: "ID" },
    { field: "status", headerName: "Status" },
    { field: "location", headerName: "Lagerort" },
]

const categoryDetails: ItemProps[] = [
    { id: 1, status: "Available", location: "Warehouse A", urn: "equipli:item:1" },
    { id: 2, status: "In Use", location: "Warehouse B", urn: "equipli:item:2" },
    { id: 3, status: "Maintenance", location: "Warehouse C", urn: "equipli:item:3" },
]

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe("CategoryDetailsTable Component", () => {
    test("renders the table with the correct column headers", () => {
        const { container } = render(
            <BrowserRouter>
                <CategoryDetailsTable
                    categoryDetails={categoryDetails}
                    colDefs={colDefs}
                    loading={false}
                />
            </BrowserRouter>
        )

        const headers = Array.from(
            container.querySelectorAll(".ag-header-cell-text")
        ).map((header) => header.textContent)

        expect(headers).toEqual(["ID", "Status"])
    })

    test("renders the correct number of rows", () => {
        const { container } = render(
            <BrowserRouter>
                <CategoryDetailsTable
                    categoryDetails={categoryDetails}
                    colDefs={colDefs}
                    loading={false}
                />
            </BrowserRouter>
        )

        const rows = container.querySelectorAll(".ag-row")
        expect(rows.length).toBe(3)
    })


})
