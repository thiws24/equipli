import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import React from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useKeycloak } from "../keycloak/KeycloakProvider"

const CategoryCreationSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  itemCount: z.number().min(1),
  itemLocation: z.string().optional()
})

type CategoryCreationType = z.infer<typeof CategoryCreationSchema>;

function CategoryCreation() {
  const form = useForm<CategoryCreationType>({
    resolver: zodResolver(CategoryCreationSchema),
    defaultValues: {
      itemCount: 1,
    },
  })

  const { token } = useKeycloak()

  const disableButton = () => {
   const values = form.getValues()
   return !values.name || !values.itemCount
  }

  async function onSubmit(values: CategoryCreationType) {
    console.log(values, values.image ? values.image[0] : '')

    const { image, ...rest } = values
    let photoUrl = null

    // First upload image to minIO an then get URL
    if (image && image[0]) {
      try {

      } catch (e) {
        // TODO: show Error
        return
      }
    }

    try {
      const createRes = await fetch(
        `${process.env.REACT_APP_II_SERVICE_HOST}/categories`,
        {
          headers: {
            "Content-Type": "application/json",
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
        window.open(`/category/${data.id}`, '_self')
      }
    } catch (e) {

    }

  }

  return (
    <Card className='w-11/12 sm:w-4/5 mx-auto my-5 md:my-10 lg:my-20'>
      <CardHeader>
        <CardTitle>Inventarisierung</CardTitle>
        <CardDescription>
          Erstelle eine neue Kategorie mit Items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
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

            <div className='sm:w-1/2'>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bild</FormLabel>
                    <FormControl>
                      <Input type='file'{...form.register('image')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col sm:flew-row gap-5 w-full'>
              <div className='w-full sm:w-1/2'>
                <FormField
                  control={form.control}
                  name="itemLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-[95px]'>
                <FormField
                  control={form.control}
                  name="itemCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anzahl Items*</FormLabel>
                      <FormControl>
                        <Input
                          {...form.register("itemCount", { valueAsNumber: true })}
                          type='number'
                          min={1}
                          {...field}
                          onChange={event => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='flex w-full justify-end'>
              <Button
                disabled={disableButton()}
                type="submit"
                className='text-customBeige bg-customBlue hover:bg-customRed'
              >
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