
export class UrlParamUtils {
  public static getUrlParam<T extends string>(name: string) {
      let url = window.location.href;

      let urlPrms = url.split('/');

      let hasPramId = urlPrms.includes(name);

      if (hasPramId) {
          let paramWordIndex = urlPrms.lastIndexOf(name);
          let id = urlPrms[paramWordIndex + 1];
          return <T>id;
      }
      return <T>'';
  }

  public static getUrlQueryParam(name: string) {
      let params = new URLSearchParams(window.location.search);
      return params.get(name);
  }

}
