export const environment = {
  production: false,
  apiUrl: 'https://mazars-api-uat.azurewebsites.net/api/',
  _apiUrlForImages: 'https://mazars-api-uat.azurewebsites.net/',
  get apiUrlForImages() {
    return this._apiUrlForImages;
  },
  set apiUrlForImages(value) {
    this._apiUrlForImages = value;
  },
  clientUrl: 'https://mazars-client-uat.azurewebsites.net/',
  excludeWords: ['të', 'së', 'i', 'për', 'si', 'e', 'dhe', 'as', 'a', 'apo', 'o', 'ose', 'ndaj', 'pa', 'pra', 'sado', 'sido', 'ne', 'pse', 'sikur', 'sa', 'saqë', 'qe', 'as sa', 'po', 'sic', 'por', 'aq', 'se', 'sesa', 'me', 'te', 'sepse', 'prej', 'ku', 'tek', 'kudo', 'ngado', 'tekdo', 'deri', 'gjer', 'para', 'posa', 'dhe të'],
};
