import { render, screen } from "@testing-library/react";
import React from "react";
import InventoryTable from "./InventoryTable";
import { InventoryItemProps } from "../interfaces/InventoryItemProps";
import { ColDef } from "ag-grid-community"
import { BrowserRouter } from "react-router-dom";

const colDefs: ColDef<InventoryItemProps, any>[] = [
  { field: "id" },
  { field: "name" },
  { field: "icon" },
  { field: "photoUrl" },
  { field: "urn" }
]

describe("InventoryTable Tests", () => {
  const rowData = [
    {
      id: 1,
      name: "Magischer Schlüssel",
      icon: "🗝️",
      photoUrl: "",
      urn: "QR-Code 001",
      location: "Lager 1",
      status: "OK",
      categoryId: 1
    },
    {
      id: 2,
      name: "Heiltrank",
      icon: "🧪",
      photoUrl: "",
      urn: "QR-Code 002",
      location: "Lager 1",
      status: "OK",
      categoryId: 2
    },
    {
      id: 3,
      name: "Drachenfeuer",
      icon: "🔥",
      photoUrl: "",
      urn: "QR-Code 003",
      location: "Lager 1",
      status: "OK",
      categoryId: 3
    },
  ]
  test('renders data correctly', () => {
    const { container } = render(<BrowserRouter><InventoryTable colDefs={colDefs} inventoryItems={rowData} loading={false} /></BrowserRouter>);
    const elements = container?.querySelector('.ag-body')?.querySelectorAll('[role="row"]')

    expect(elements?.length).toBe(3)

    expect(screen.getByText("Drachenfeuer")).toBeDefined()
  })

  test('should have expected column headers', () => {
    const { container } = render(<BrowserRouter><InventoryTable colDefs={colDefs} inventoryItems={rowData} loading={false} /></BrowserRouter>);
    const headers = Array.from(container?.querySelectorAll('.ag-header-cell-text')).map(function (header) {
      return header.textContent
    })

    expect(headers).toEqual(['Id', 'Name', 'Icon', 'Photo Url', 'Urn']);
  });
})