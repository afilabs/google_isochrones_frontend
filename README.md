# google_isochrones_frontend

![Google Isochrones API](https://storage.ghost.io/c/c6/4d/c64da7e8-63a6-4cff-acdc-2782a6ebc377/content/images/size/w1600/2026/11/isochrones-mockup.png " Google Isochrones API")

Taken from: 
- [Mapping travel time with the Google Maps Isochrones API](https://blog.afi.io/blog/mapping-travel-time-with-the-google-maps-isochrones-api)
- [How isochrones work: From shortest paths to polygons](https://afi.io/blog/how-isochrones-work-from-shortest-paths-to-polygons)
- [Build an isochrone map with the Google Isochrone API](https://blog.afi.io/blog/build-an-isochrone-map-with-the-google-isochrone-api/)
  
**Prerequisite:** Start [google_isochrones_backend](https://github.com/afilabs/google_isochrones_backend) locally (it runs on port 3001), or set `VITE_API_BASE_URL` in `.env` to your deployed backend URL.

How to run the app:

1. cd into your project folder
2. Open terminal and run `npm install` (this will install the required dependencies)
3. Update the `.env` file with a Google Maps API key that has the Google Elevation API enabled
4. Run `npm run dev`

Please contact afian@afi.io if you have any questions or suggestions. Pull requests are welcome.