import { ADD_CLIENT} from '../type';
import {toast} from "react-toastify";
import clientService from '../../../Components/Services/client.service';

export const addClient = (inputs) => async (dispatch) => {

 clientService.addClient(inputs).then(
        (response) => {
            dispatch({type:ADD_CLIENT});
            if (response.data.status === 0) {
                toast.success('Login Successfull');
            }
        },
    ).catch((error) => {
        if (error.message === "Request failed with status code 401")
            toast.error('Unauthorised Access - invalid credentials!!');
        else if (error.message === "Network Error")
           toast.error('Network Error!!');
    });
}

export const addContacts = () =>{
    
}