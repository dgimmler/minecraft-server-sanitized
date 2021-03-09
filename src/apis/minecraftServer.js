import axios from "axios";
import { config } from "../config";

const apiId = config.apiId;
const apiVersion = config.apiVersion;

export default axios.create({
  baseURL:
    "https://" + apiId + ".execute-api.us-west-2.amazonaws.com/" + apiVersion,
});
