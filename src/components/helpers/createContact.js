import isMobilePhone from "validator/lib/isMobilePhone";
import { Manager } from "@twilio/flex-ui";
import validatePhoneNumber from "./validatePhoneNumber";
export default async function createContact(fullname, workerorder, phone) {



    const uriFullName = encodeURIComponent(fullname);
    const uriWorkerOrder = encodeURIComponent(workerorder);
    const uriPhone = encodeURIComponent(phone);
    const token = Manager.getInstance().user.token;
    const baseURL = process.env.REACT_APP_CALLCENTER_FUNCTIONS_BASEURL;

    try {
        const response = await fetch(
            `${baseURL}/callcenter/create-contact?fullname=${uriFullName}&workerorder=${uriWorkerOrder}&phone=${uriPhone}&Token=${token}`,
            {
                method: "GET", mode: 'cors', headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok)
            return { isError: true, Error: response.statusText, StatusCode: response.status }

        const json = await response.json();
        const newEntry = json.data;
        return newEntry;
    } catch (error) {
        console.log('error---', error)
        let data = { 'isError': true, error };
        //alert("Already exists");
        return data;
        throw new Error(error);
    }

}