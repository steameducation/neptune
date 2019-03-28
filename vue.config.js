module.exports = {
    pwa: {
        themeColor: '#F7BC3D',
    },
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8085,
        https: true,
        hotOnly: false,
    },
}
