"use client";

import ReactPlayer from "react-player"


const YoutubeVideoPlayer = ({
    videoId,
    onVideoFinished }
    : {
        videoId: string,
        onVideoFinished?: () => void
    }) => {
    return (
        <ReactPlayer 
        className="w-full h-full"
     width={"100%"} 
        src={videoId}
         />
    )
}

export default YoutubeVideoPlayer