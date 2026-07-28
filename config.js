/* Google Places live reviews config
 *
 * 1. Create a key at https://console.cloud.google.com/apis/credentials
 * 2. Enable "Places API" (and/or "Maps JavaScript API")
 * 3. Restrict the key to your domain (HTTP referrers)
 * 4. Paste the key below
 *
 * Without a key, the site still shows cached Google reviews as a fallback.
 */
window.SHERLOCK_CONFIG = {
    googleMapsApiKey: '', // e.g. 'AIza...'
    placeId: 'ChIJQ2n9SAAhWksRDf0OYUfOFMs',
    mapsUrl: 'https://maps.app.goo.gl/Snmxmp1NYea7dXof6?g_st=ic',
    maxReviews: 3
};
