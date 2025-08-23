export const createUser = async (req, res) => {
    res.json({message: "User created"}); 
}

export const loginUser = async (req, res) => {
    res.json({message: "User has been logged in"}); 
}

export const logoutUser = async (req, res) => {
    res.json({message: "User has been logged out"}); 
}