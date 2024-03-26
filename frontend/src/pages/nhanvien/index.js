// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableBasic from 'src/views/tables/TableBasic'
<<<<<<< HEAD
=======


>>>>>>> afafd89b433caa34351c487ae9c009fa3a53f0b8


const bangnhanvien = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
<<<<<<< HEAD
            Bảng Nhân viên
=======
            Bảng Nhân Viên
>>>>>>> afafd89b433caa34351c487ae9c009fa3a53f0b8
          </Link>
        </Typography>
        <Typography variant='body2'></Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
<<<<<<< HEAD
          <CardHeader title='Bảng nhân viên' titleTypographyProps={{ variant: 'h6' }} />
=======
          <CardHeader title='Danh sách nhân viên' titleTypographyProps={{ variant: 'h6' }} />
>>>>>>> afafd89b433caa34351c487ae9c009fa3a53f0b8
          <TableBasic />
        </Card>
      </Grid>
    </Grid>
  )
}




export default bangnhanvien
