const getJargons = async () => {
    const url = 'https://one00x-data-analysis.onrender.com/assignment?email=damodarnaik101@gmail.com';
    return await fetch(url, {
        method: 'get',
    }).then(async response => {
        if (response.ok) {
            const headers = response.headers;
            const data = await response.json();
            return {
                'assignmentID': response.headers.get('x-assignment-id'),
                'jargons': data
            }
        } else {
            return new Error('getting jargons failed'); // Handle failure
        }
    }).catch(error => {
        console.log(error)
    })
}



(async () => {
    try {
        let dataa = await getJargons();
        console.log('assignment_id: ' + dataa.assignmentID);
        let counts = {}
        let maxUsedJargon = '';
        dataa.jargons.forEach((item) => {
            if (!maxUsedJargon) {
                maxUsedJargon = item;
            }
            if (counts?.[item]) {
                if ((counts[item] + 1) > Math.max(...Object.values(counts))) {
                    maxUsedJargon = item
                }
                counts = { ...counts, [item]: (counts[item] + 1) };
            } else {
                counts = { ...counts, [item]: 1 }
            }

        })
        console.log('answer: '+ maxUsedJargon);

        const url = 'https://one00x-data-analysis.onrender.com/assignment';
        await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "assignment_id": dataa.assignmentID,
                "answer": maxUsedJargon
            }),
        }).then(async response => {

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                return new Error('submitting answer failed');
            }
        }).catch(error => {
            console.log(error);
        })

    } catch (error) {
        console.error('An error occurred:', error);
    }
})();