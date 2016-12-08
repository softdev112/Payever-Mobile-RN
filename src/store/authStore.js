import { observable } from 'mobx';
import PayeverApi from '../common/api/index';


class AuthStore {
  @observable loggedIn = false;
  @observable accessToken = null;
  @observable refreshToken = null;
  @observable expiresIn = null;

  async signIn(username, password, navigator) {
    const api = new PayeverApi({
      baseUrl: 'https://mein.payever.de',
      clientId: '1633_3vi6g4uiwmyow8044o4w0wo4s88cogosw84kw888kw408wok8c',
      clientSecret: '63nqx0kppzocw4sswok8gg800sk4w4kko4k0oo8gs4ow00wgos'
    });
    try {
      const resp = await api.auth.login(username, password);
      if (!resp.ok) {
        console.log(resp.data);
        return;
      }

      this.accessToken = resp.data.access_token;
      this.refreshToken = resp.data.refresh_token;
      this.expiresIn = resp.data.expires_in;
      this.loggedIn = true;

      /*navigator.resetTo({
        screen: 'dashboard.Businesses',
        animated: true
      });*/
    } catch (e) {
      console.error(e);
    }
  }
}

export default new AuthStore();