import React from 'react';
import './globals.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community"
import InventoryCard from './components/ui/InventoryCard';

interface ColDefProps {
  id: string;
  name: string;
  icon: string;
  foto: string;
  "qrCode": string;
}

function App() {
  const [inventoryItems, setInventoryItems] = React.useState<ColDefProps[]>([])

  const colDefs: ColDef<ColDefProps, any>[] = [
    {field: "id", flex: 1},
    {field: "name", flex: 1},
    {field: "icon", flex: 1},
    {field: "foto", flex: 1},
    {field: "qrCode", flex: 1}
  ]

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch data from DB - remove setTimeout
    setTimeout(() => {
      setInventoryItems([
        {
          id: "001",
          name: "Magischer Schlüssel",
          icon: "🗝️",
          foto: "",
          qrCode: "QR-Code 001"
        },
        {
          id: "002",
          name: "Heiltrank",
          icon: "🧪",
          foto: "",
          qrCode: "QR-Code 002"
        },
        {
          id: "003",
          name: "Drachenfeuer",
          icon: "🔥",
          foto: "",
          qrCode: "QR-Code 003"
        },
        {
          id: "004",
          name: "Schatzkarte",
          icon: "🗺️",
          foto: "",
          qrCode: "QR-Code 004"
        },
        {
          id: "005",
          name: "Unsichtbarkeitstrank",
          icon: "🧙‍♂️",
          foto: "",
          qrCode: "QR-Code 005"
        },
        {
          id: "006",
          name: "Elfenbogen",
          icon: "🏹",
          foto: "",
          qrCode: "QR-Code 006"
        },
        {
          id: "007",
          name: "Zeitstopper",
          icon: "⏳",
          foto: "",
          qrCode: "QR-Code 007"
        },
        {
          id: "008",
          name: "Kristall der Weisheit",
          icon: "💎",
          foto: "",
          qrCode: "QR-Code 008"
        },
        {
          id: "009",
          name: "Portalstein",
          icon: "🌌",
          foto: "",
          qrCode: "QR-Code 009"
        },
        {
          id: "010",
          name: "Rune der Macht",
          icon: "⚡",
          foto: "",
          qrCode: "QR-Code 010"
        }
      ])
      setLoading(false)
    }, 1250)

  }, [])

  return (
    <div className="m-10">
      <main className="main">
        <InventoryCard 
          inventoryItems={inventoryItems} 
          colDefs={colDefs} 
          loading={loading} 
        />
      </main>
    </div>
  );

}

export default App;