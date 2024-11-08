import * as React from 'react';
import { InventoryItemProps } from "../interfaces/InventoryItemProps";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import {useState} from "react";
import { Button } from "./ui/button";

export const DetailView: React.FC<InventoryItemProps> = ({ id, photo, name, description, icon, urn }) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // tmp for showcase purposes
    description = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt" +
        " ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et" +
        " ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."

    return (
        <Card>
            <CardHeader className="flex items-center">
                <CardTitle> {`${icon ?? 'x'}`} Detailansicht </CardTitle>
            </CardHeader>
            <div>
                <CardContent>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{name}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Artikelnummer</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{id}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Beschreibung</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{description}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Foto</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0
                                w-64 h-64 border-4 border-gray-300 rounded-lg overflow-hidden">
                                    <img src={`data:image/jpeg;base64,${photo}`} alt={description} className='w-full h-full object-cover'/>
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">QR-Code</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded
                                        hover:bg-blue-600"> Show QR-Code
                                    </button>
                                    {isOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                            <p>{urn}</p>
                                            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500
                                                text-white rounded hover:bg-red-600 flex items-center"> Close
                                            </button>
                                        </div>
                                    </div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => navigate('/')}> &larr; Zurück </Button>
                </CardFooter>
            </div>
        </Card>
    )
}
