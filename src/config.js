export const config = {
  apiId: "<API Gateway ID>",
  apiVersion: "v1",
  userPoolId: "<Cognito pool ID>",
  clientId: "<Cognito clientId>",
  domain: "happylandingsserver.com",
  secure: true,
  region: "us-west-2",
  cookieExpiration: 1,
  cookiePath: "/",
  mandatorySignIn: true,

  // server info
  minecraftVersion: "1.16.4",
  serverIp: "<IP of minecraft server>",
  texturePack: {
    name: "Sphax PureBDCraft",
    url: "https://bdcraft.net/downloads/purebdcraft-minecraft/",
  },
};
