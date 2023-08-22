document.getElementById("name").focus();

const submitBtn=document.getElementById("signup");

submitBtn.addEventListener('click',formValidation);
  
function formValidation(event){
    event.preventDefault();
    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const phoneNumber=document.getElementById("phoneNumber").value;
    const password=document.getElementById("password").value;
   if (!name || !email || !phoneNumber || !password) {
                document.getElementById("error-message").innerText = "Please fill in all (*) fields.";
            } 
            else{
              document.getElementById("error-message").innerText="";
              saveToDatabase();
            }
}

function saveToDatabase(){

    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const phoneNumber=document.getElementById("phoneNumber").value;
    const password=document.getElementById("password").value;

    const userdetails={name:name, 
        email:email, 
        phoneNumber:phoneNumber,
        password:password
        }

        axios.post('http://localhost:3000/user/signup',userdetails)
        .then((response)=>{
              
         if (response.data.status === 409) {
          document.getElementById('error-message').innerText = "Error:Request failed with status code 409 (or) Email already registered. Please use a different email.";
          document.getElementById("name").value="";
             document.getElementById("email").value="";
             document.getElementById("phoneNumber").value="";
             document.getElementById("password").value="";
             alert('User already exists, Please Login');
        }else{
             document.getElementById("name").value="";
             document.getElementById("email").value="";
             document.getElementById("phoneNumber").value="";
             document.getElementById("password").value="";
             alert('Successfully signed up');

        }
             

             })

        .catch((err)=>{
          document.getElementById('error-message').innerText = "Error:Request failed with status code 409 (or) Email already registered. Please use a different email.";
          console.log('An error occurred:', err);
        })
   }


