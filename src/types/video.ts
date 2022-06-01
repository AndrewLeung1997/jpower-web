export interface Video {
    category: {
        categoryId: number, // integer
        categoryName: string, // category name
        categoryImageUrl?: string, // url to image
    },
    videoId: string, // video id, in format yymmdd00x
    videoDisplayName: string, // video display name
    videoDuration: number, // integer, in milliseconds
    videoTag: string[], // video tags
    videoUrl: string, // url to video
    viewCount: number, // number of views
    uploadTime: string, // date string
    uploadUser: { userName: string, userId: string, role: "user" | "admin" }, // user info
    videoPreviewImage?: string, // url to preview image
}

