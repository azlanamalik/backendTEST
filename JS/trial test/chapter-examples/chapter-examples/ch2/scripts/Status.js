function getStatus(checks, status) {
    return new Promise((resolve) => {
        const count = checks.filter(c => c.status === status).length
        resolve(count)
    })
}

export default getStatus