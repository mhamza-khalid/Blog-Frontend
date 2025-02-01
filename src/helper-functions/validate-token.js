

export default async function validateToken(flag){
    
    if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:3000/login/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            if (response.status != 200 && flag != 'false') { //invalid token decoded
                alert('Please sign in first')
            }
            //token decoded successfully
            let data = await response.json();
            //now we have the signed in users id in data.id and name in data.name
            //we have to send a post request to the server to create a new comment

            return data 

        }
        catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    else{
        return false
    }
}

