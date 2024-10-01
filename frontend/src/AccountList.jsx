import React from "react"

const AccountList = ({accounts, updateAccount, updateCallback}) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_account/${id}`, options)
            if (response.status === 200){
                updateCallback()
            }
            else{
                console.error("Failed to delete account")
            }
        }
        catch (error) {
            alert(error)
        }
    }

    return <div>
        <h2>Accounts</h2>
        <table>
            <thead>
                <tr>
                    <th>Platform</th>
                    <th>Account Name</th>
                    <th>Password</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {accounts.map((account) => (
                    <tr key = {account.id}>
                        <td>{account.platform}</td>
                        <td>{account.account}</td>
                        <td class = "hide-text">{account.password}</td>
                        <td>
                            <button onClick = {() => updateAccount(account)}>Edit</button>
                            <button onClick = {() => onDelete(account.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default AccountList