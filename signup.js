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
             clearFields();
             alert('Successfully signed up');
             location.href = 'login.html';
      })
        .catch((err)=>{
            if(err.response.status === 409) {
             clearFields();
             alert('User already exists, Please Login');
            }else{
               console.log('An error occurred:', err);
            }
             
        });
   };

function clearFields(){
document.getElementById("name").value="";
document.getElementById("email").value="";
document.getElementById("phoneNumber").value="";
document.getElementById("password").value="";
}