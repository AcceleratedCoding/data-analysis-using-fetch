const getJargons = async () => {
    try {
        const url = 'https://one00x-data-analysis.onrender.com/assignment?email=damodarnaik101@gmail.com';
        return await fetch(url, {
            method: 'get',
        }).then(async response => {
            if (response.ok) {
                const data = await response.json();
                return {
                    'assignmentID': response.headers.get('x-assignment-id'),
                    'jargons': data
                }
            } else if (response.status == 500) {
                return await getJargons();
            }
        })
    } catch {
        return new Error(error);
    }
}



(async () => {
    try {
        let dataa = await getJargons();
        console.log('assignment_id: ' + dataa.assignmentID);
        const allJargons = dataa.jargons;
        let counts = {}
        let maxUsedJargon = '';
        if (allJargons?.length >= 1) {
            allJargons.forEach((item) => {

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
            console.log('answer: ' + maxUsedJargon);

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
        } else {
            console.log("Jargons array received is empty")
        }


    } catch (error) {
        console.error('An error occurred:', error);
    }
})();