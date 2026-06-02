const fetchMe = async () =>{
    const response = await fetch('/api/auth/me');
    if(!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
}