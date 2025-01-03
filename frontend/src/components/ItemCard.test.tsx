import { render, screen } from "@testing-library/react"
import { ItemCard } from "./ItemCard"
import { test, describe, expect } from "vitest"

describe("ItemCard", () => {
    test("renders correct link", () => {
        render(
            <ItemCard
                id={2}
                photoUrl={""}
                name={""}
                icon={""}
                urn={""}
                location={""}
                status={""}
                categoryId={2}
            />
        )
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "/item/2"
        )
    })
})
