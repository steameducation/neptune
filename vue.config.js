module.exports = {
  pwa: {
    themeColor: '#F7BC3D',
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/neptune/' : '/',
  // need https (even if fake) to test record feature on mobile
  // devServer: {
  //     open: process.platform === 'darwin',
  //     host: '0.0.0.0',
  //     port: 8080,
  //     https: true,
  //     hotOnly: false,
  // },
  // publicPath: '/neptunebeta/',
}
