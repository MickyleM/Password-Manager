import { useState } from "react"

const AccountForm = ({existingAccount = {}, updateCallback}) => {
    const [platform, setPlatform] = useState(existingAccount.platform || "")
    const [account, setAccount] = useState(existingAccount.account || "")
    const [password, setPassword] = useState(existingAccount.password || "")

    const updating = Object.entries(existingAccount).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            platform,
            account,
            password
        }

        const url = "http://127.0.0.1:5000/" + (updating ? `update_account/${existingAccount.id}` : "save_account")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if(response.status !== 201 && response.status !== 200){
            const data = await response.json()
            alert(data.message)
        }
        else{
            updateCallback()
        }
    }

    const displayPassword = () => {
        var data = document.getElementById("password")
        if(data.type === "password"){
            data.type = "text"
        } else {
            data.type = "password"
        }
    }

    return <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="platform">Platform: </label>
            <input type = "text" id = "platform" value = {platform} onChange={(e) => setPlatform(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="account">Account Name: </label>
            <input type="text" id="account" value={account} onChange={(e) => setAccount(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
            <input type="checkbox" onClick={() => displayPassword()} />Show Password
        </div>
        <button type = "submit">{updating? "Edit" : "Create"}</button>
    </form>
}

export default AccountForm