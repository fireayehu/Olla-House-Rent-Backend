const adminList = ['se.nabek.abebe@gmail.com']

exports.isAdmin = (user) => {
    if (adminList.includes(user.email.trim())) {
        return true
    }
    return false
}