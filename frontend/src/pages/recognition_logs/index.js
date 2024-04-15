// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// ** Demo Components Imports
import RecognitionLogsList from 'src/views/recognition_logs/RecognitionLogList'
import request from 'src/lib/api'

const RecognitionLogsManagement = () => {
  const router = useRouter()
  const [recognitionlogList, setRecognitionlogList] = useState([])

  useEffect(() => {
    getRecognitionlogs()
  }, [])

  const getRecognitionlogs = async () => {
    if (router.isReady) {
      const res = await request('GET', 'recognition_logs', router)
      if (res && res.status === 200) {
        console.log(res.data)
        setRecognitionlogList(res.data.recognition_logs)
      }
    }
  }


  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            Quản lý phòng ban
          </Typography>
          <Typography variant='body2'>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Danh sách phòng ban' titleTypographyProps={{ variant: 'h6' }} />
            <RecognitionLogsList
            recognitionlogList={recognitionlogList}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default RecognitionLogsManagement
