export class NewId {

  public static get() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    let res = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
    return res;
};
}
