module.exports = {
    /**
     * Get the video ID from Youtube url link
     * Eg: https://www.youtube.com/watch?v=uKxyLmbOc0Q will return "uKxyLmbOc0Q"
     * @param {string} url 
     * @return the ID string or `null` if the link is not youtube
     * Simplified from https://github.com/jmorrell/get-youtube-id
     */
    extractYoutubeVideoId (url) {
        if (/youtu\.?be/.test(url)) {
    
            // Look first for known patterns
            var i;
            var patterns = [
                /youtu\.be\/([^#\&\?]{11})/,  // youtu.be/<id>
                /\?v=([^#\&\?]{11})/,         // ?v=<id>
                /\&v=([^#\&\?]{11})/,         // &v=<id>
                /embed\/([^#\&\?]{11})/,      // embed/<id>
                /\/v\/([^#\&\?]{11})/         // /v/<id>
            ];
    
            // If any pattern matches, return the ID
            for (i = 0; i < patterns.length; ++i) {
                if (patterns[i].test(url)) {
                    return patterns[i].exec(url)[1];
                }
            }
        }
    
        return null;
    }

}