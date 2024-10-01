import { useState, useEffect } from 'react'
import AccountList from './AccountList'
import './App.css'
import AccountForm from './AccountForm'

function App() {
  const [accounts, setAccounts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState({})

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async() => {
    const response = await fetch("http://127.0.0.1:5000/accounts")
    const data = await response.json()
    setAccounts(data.accounts)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAccount({})
  }

  const openCreateModal = () => {
    if(!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (account) => {
    if (isModalOpen) return
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchAccounts()
  }

  return (
    <>
      <AccountList accounts={accounts} updateAccount={openEditModal} updateCallback={onUpdate}/>
      <button onClick = {openCreateModal}>Create New Account</button>
      {isModalOpen && <div className = "modal">
        <div className = "modal-content">
          <span className = "close" onClick = {closeModal}>&times;</span>
          <AccountForm existingAccount={selectedAccount} updateCallback={onUpdate}/>
        </div>
      </div>
      }
    </>
  )
}

export default App
