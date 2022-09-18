import React, { useEffect, useState } from 'react'
import { Typography, Paper, Theme, Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import '../Player/style.css'
import { Video } from '../../types/video'
import VideoCard from '../VideoCard'
import { api } from '../../api'
import Loader from '../../lib/loader'
import { commonStyles } from '../../lib/styles'
import { useIsSmallWidth } from '../App'
import VideoPlayer from '../VideoPlayer'
import draw from '../../file/draw.jpeg'

const styles = {
  relatedVideoPaper: (theme: Theme) => ({
    marginTop: 2,
    // marginBottom: theme.space * 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.space * 1}px ${theme.space * 2}px ${theme.space * 2}px`,
    backgroundColor: '#222',
    color: 'white',
  }),
  videoName: {
    marginTop: 3,
    fontSize: '20px',
  },
}

function Player() {
  const [relatedVideos, setRelatedVideos] = useState<Video[] | null>(null)
  const [popularVideos, setPopularVideos] = useState<Video[] | null>(null)
  const [video, setVideo] = useState<Video | null>(null)

  const params = useParams()
  const videoId = params.id

  const isSmallWidth = useIsSmallWidth()

  useEffect(() => {
    if (video) getVideoByCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video])

  useEffect(() => {
    setVideo(null)
    setRelatedVideos(null)
    getVideoByID()
    getPopularVideos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  return (
    <Box sx={commonStyles.main}>
      {!video ? (
        <Loader sx={{ marginTop: 5 }} />
      ) : (
        <React.Fragment>
          <div className="row">
            <div className="col-md-12">
              <div className="text-center">
                <a href="https://www.dchungmingvip666.com/" target="_blank">
                  <img
                    src={draw}
                    style={{
                      width: '70%',
                      height: 'auto',
                      paddingTop: '20px',
                      paddingLeft: '50px',
                      paddingRight: '40px',
                    }}
                  ></img>
                </a>
              </div>
            </div>
          </div>
          <Box sx={{ display: 'flex', marginTop: 5 }}>
            <VideoPlayer video={video} />
            {!isSmallWidth && (
              <Paper
                sx={{
                  width: '30vw',
                  maxHeight: '700px',
                  overflow: 'auto',
                  backgroundColor: '#222',
                  marginTop: 9,
                }}
              >
                {relatedVideos ? (
                  relatedVideos.map((value, index) => (
                    <VideoCard
                      video={value}
                      key={index}
                      sx={{ width: '100%' }}
                    />
                  ))
                ) : (
                  <Loader />
                )}
              </Paper>
            )}
          </Box>
          <Paper sx={styles.relatedVideoPaper}>
            <Typography
              sx={styles.videoName}
              component="h2"
              variant="h5"
              align="left"
            >
              {isSmallWidth ? '相關影片' : '熱門影片'}
            </Typography>
            <Box className="row" sx={{ width: '90vw' }}>
              {(() => {
                const videos = isSmallWidth ? relatedVideos : popularVideos
                return videos ? (
                  videos.map((value, index) => (
                    <VideoCard video={value} key={index} />
                  ))
                ) : (
                  <Loader position={'flex-start'} />
                )
              })()}
            </Box>
          </Paper>
        </React.Fragment>
      )}
    </Box>
  )

  function getVideoByID() {
    api
      .get(`/videos/${videoId}`)
      .then((res: { data: { video: Video } }) => {
        setVideo(res.data.video)
      })
      .catch((err) => {
        alert(err?.response?.data?.error)
      })
  }

  function getVideoByCategory() {
    api
      .get(`/videos?cat=${video?.category?.categoryId}&limit=20`)
      .then((res: { data: { videos: Video[] } }) => {
        setRelatedVideos(
          res.data.videos.filter((value) => value.videoId !== videoId),
        )
      })
      .catch((err) => {
        alert(err?.response?.data?.error)
      })
  }

  function getPopularVideos() {
    api
      .get(`/videos?limit=20&filter=popular`)
      .then((res: { data: { videos: Video[] } }) => {
        setPopularVideos(
          res.data.videos.filter((value) => value.videoId !== videoId),
        )
      })
      .catch((err) => {
        alert(err?.response?.data?.error)
      })
  }
}

export default Player
