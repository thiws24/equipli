import { ProcessInputProps } from "../interfaces/ProcessInputProps";
import { Process } from "../interfaces/Process";

const reportMetadataColumns = [
    {
        "Header": "Id",
        "accessor": "id",
        "filterable": false
    },
    {
        "Header": "Process",
        "accessor": "process_model_display_name",
        "filterable": false
    },
    {
        "Header": "Task",
        "accessor": "task_title",
        "filterable": false
    },
    {
        "Header": "Start",
        "accessor": "start_in_seconds",
        "filterable": false
    },
    {
        "Header": "End",
        "accessor": "end_in_seconds",
        "filterable": false
    },
    {
        "Header": "Started by",
        "accessor": "process_initiator_username",
        "filterable": false
    },
    {
        "Header": "Last milestone",
        "accessor": "last_milestone_bpmn_name",
        "filterable": false
    },
    {
        "Header": "Status",
        "accessor": "status",
        "filterable": false
    },
    {
        "Header": "Waiting for",
        "accessor": "waiting_for",
        "filterable": false
    }
]


export async function fetchWaitingProcessesByTaskNameAndItemId(taskName: string, itemId: number, token: string): Promise<Process[]> {
    try {
        const response = await fetch(`${process.env.REACT_APP_SPIFF}/api/v1.0/process-instances`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "report_metadata": {
                    "columns": reportMetadataColumns,
                    "filter_by": [
                        {
                            "field_name": "process_status",
                            "field_value": "user_input_required,waiting",
                            "operator": "equals"
                        },
                        {
                            "field_name": "with_oldest_open_task",
                            "field_value": true,
                            "operator": "equals"
                        }
                    ],
                    "order_by": [
                        "-start_in_seconds",
                        "-id"
                    ]
                }
            })
        })

        if (response.ok) {
            const data = await response.json()
            let processes: Process[] = data.results.filter((p: Process) => p.task_title === taskName)

            return await filterWaitingProcessesByItemId(processes, itemId, token);
        }
    } catch (e) {
        console.log(e)
    }
    return []
}


export async function filterWaitingProcessesByItemId(data: Process[], itemId: number, token: string): Promise<Process[]> {
    const filteredProcesses: Process[] = []
    // Fetch Data Object for each process
    await Promise.all(data.map(async (pItem) => {
        const dataRes = await fetchDataObjectFromProcess(pItem.id, token)
        if (dataRes && dataRes.InventoryItemId === itemId) {
            filteredProcesses.push({
                ...pItem,
                dataObject: dataRes
            })
        }
    }))

    return filteredProcesses
}

export async function fetchDataObjectFromProcess(processId: number, token: string): Promise<ProcessInputProps|undefined> {
    try {
        const response = await fetch(`${process.env.REACT_APP_SPIFF}/api/v1.0/process-data/default/equipli-processes:inventory-management-processes:reservation-to-return-process/reservationrequest/${processId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if (response.ok) {
            const dataObject = await response.json()
            return dataObject.process_data_value
        }

    } catch (e) {
        console.log(e)
    }

    return undefined
}