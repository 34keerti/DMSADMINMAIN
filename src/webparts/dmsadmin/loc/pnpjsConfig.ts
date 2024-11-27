import { WebPartContext } from "@microsoft/sp-webpart-base";
// import pnp and pnp logging system
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import "@pnp/sp/items/get-all";
import "@pnp/sp/folders";
import "@pnp/sp/files/folder";
import "@pnp/sp/fields";
import { MSGraphClientV3 } from "@microsoft/sp-http";
// var _sp: SPFI;
// export const getSP = (context?: WebPartContext): SPFI => {
//   if (context != null && (_sp === undefined ||_sp === null)) {
//     //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
//     // The LogLevel set's at what level a message will be written to the console
//     _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
//   }
//   return _sp;
// };

var _sp: SPFI;
export const getSP = (context?: WebPartContext): SPFI => {
  
    
  if (context !== null && (_sp === undefined ||_sp === null)) {
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  
    
  }
  

return _sp;
}

  /**
 * Initializes and returns an MSGraphClient instance for Graph API calls.
 * @param context - SPFx WebPartContext to initialize the MSGraphClient.
 */
// @ts-ignore
export const getGraphClient = async (context: WebPartContext): Promise<MSGraphClientV3> => {
  return await context.msGraphClientFactory.getClient("3")
};