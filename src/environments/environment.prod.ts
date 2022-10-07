export const environment = {
  production: true,
  apiUrl: 'https://mazars-api-qc.azurewebsites.net/api/',
  _apiUrlForImages: 'https://mazars-api-qc.azurewebsites.net/',
  get apiUrlForImages() {
    return this._apiUrlForImages;
  },
  set apiUrlForImages(value) {
    this._apiUrlForImages = value;
  },
  clientUrl: 'https://mazars-client-qc.azurewebsites.net/',
  excludeWords: ['të', 'së', 'i', 'për', 'si', 'e', 'dhe', 'as', 'a', 'apo', 'o', 'ose', 'ndaj', 'pa', 'pra', 'sado', 'sido', 'ne', 'pse', 'sikur', 'sa', 'saqë', 'qe', 'as sa', 'po', 'sic', 'por', 'aq', 'se', 'sesa', 'me', 'te', 'sepse', 'prej', 'ku', 'tek', 'kudo', 'ngado', 'tekdo', 'deri', 'gjer', 'para', 'posa', 'dhe të'],
};
