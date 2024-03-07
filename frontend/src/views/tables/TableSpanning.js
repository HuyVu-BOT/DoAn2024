// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

const TAX_RATE = 0.07

const ccyFormat = num => {
  return `${num.toFixed(2)}`
}

const priceRow = (qty, unit) => {
  return qty * unit
}

const createRow = (desc, qty, unit) => {
  const price = priceRow(qty, unit)

  return { desc, qty, unit, price }
}

const subtotal = items => {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0)
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99)
]
const invoiceSubtotal = subtotal(rows)
const invoiceTaxes = TAX_RATE * invoiceSubtotal
const invoiceTotal = invoiceTaxes + invoiceSubtotal

const TableSpanning = () => {
  return (
    <TableContainer component={Paper}>
      
    </TableContainer>
  )
}

export default TableSpanning
