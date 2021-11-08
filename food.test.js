const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('food tests', () => {

    it('test runner works', () => {
        expect(1).toBe(1)
    })

    it('missing name error', async () => {
        
        const postResponse = await client.post('/api/food', {'calories': 200})

        expect(postResponse.code).toBe(400)
    })

    it('negative calories error', async () => {
        
        const postResponse = await client.post('/api/food', {'name': 'peneszesburger','calories': -200})

        expect(postResponse.code).toBe(400)
    })

    it('can create new food', async () => {
        let kocsonya = {'name': 'kocsonya', 'calories': 900};
        
        const postResponse = await client.post('/api/food', kocsonya)
        
        expect(postResponse.code).toBe(201)
        const created = JSON.parse(postResponse.body)
        expect(created.id).toBeDefined()
        kocsonya.id = created.id
        expect(created).toEqual(kocsonya)
    })

    it('can return created food', async () => {
        let kocsonya = {'name': 'kocsonya', 'calories': 900}
        let disznoful = {'name': 'disznófül', 'calories': 150}

        const kocsonyaResponse = await client.post('/api/food', kocsonya)
        const kocsonyaId = JSON.parse(kocsonyaResponse.body).id
        const disznofulResponse = await client.post('/api/food', disznoful)
        const disznofulId = JSON.parse(disznofulResponse.body).id

        const getResponse = await client.get('/api/food')
        expect(getResponse.code).toBe(200)

        const getResponseBody = JSON.parse(getResponse.body)
        kocsonya.id = kocsonyaId
        disznoful.id = disznofulId

        expect(getResponseBody).toContainEqual(kocsonya)
        expect(getResponseBody).toContainEqual(disznoful)
    })

    it('can read food', async () => {
        const disznoful = {'name': 'disznófül', 'calories': 150}

        const postResponse = await client.post('/api/food', disznoful)
        const disznofulId = JSON.parse(postResponse.body).id

        const getResponse = await client.get('/api/food/' + disznofulId)
        expect(getResponse.code).toBe(200)
        disznoful.id = disznofulId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(disznoful)
    })

    it('get returns error for non-existent food', async () => {
        const getResponse = await client.get('/api/food/invalid')
        expect(getResponse.code).toBe(404)
    })

    it('put returns error for non-existent food', async () => {
        let disznoful = {'name': 'disznófül', 'calories': 150}
        const putResponse = await client.put('/api/food/invalid', disznoful)
        expect(putResponse.code).toBe(404)
    })

    it('delete returns error for non-existent food', async () => {
        const deleteResponse = await client.delete('/api/food/invalid')
        expect(deleteResponse.code).toBe(404)
    })

    it ('can update food', async () => {
        let disznoful = {'name': 'disznófül', 'calories': 150}

        const postResponse = await client.post('/api/food', disznoful)
        const disznofulId = JSON.parse(postResponse.body).id
        disznoful.id = disznofulId

        disznoful.name = 'Disznófül'
        disznoful.calories = 200
        const putResponse = await client.put('/api/food/' + disznofulId, disznoful)
        expect(putResponse.code).toBe(200)

        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody).toEqual(disznoful)

        const getResponse = await client.get('/api/food/' + disznofulId)
        expect(getResponse.code).toBe(200)

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(disznoful)
        
    })

    it('can delete food', async () => {
        let disznoful = {'name': 'disznófül', 'calories': 150}
        const postResponse = await client.post('/api/food', disznoful)
        disznoful.id = JSON.parse(postResponse.body).id
        
        const deleteResponse = await client.delete('/api/food/' + disznoful.id)
        expect(deleteResponse.code).toBe(204)

        const getResponse = await client.get('/api/food')
        expect(JSON.parse(getResponse.body)).toEqual(expect.not.arrayContaining([disznoful]))
    })

    it ('put id error', async () => {
        let disznoful = {'name': 'disznófül', 'calories': 150}

        const postResponse = await client.post('/api/food', disznoful)
        const disznofulId = JSON.parse(postResponse.body).id
        disznoful.id = disznofulId + 1

        disznoful.name = 'Disznófül'
        disznoful.calories = 200
        const putResponse = await client.put('/api/food/' + disznofulId, disznoful)
        expect(putResponse.code).toBe(400)

        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody.id).not.toEqual(disznoful.id)
    })
})