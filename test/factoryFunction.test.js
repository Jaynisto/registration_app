const assert = require('assert');
const factoryFunction = require('../database/factoryFunction');
const pgp = require('pg-promise')();

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Jnisto9801@localhost:5432/reg_tests";

const db = pgp(connectionString);

describe('Database test for Registration Web App', function(){

    beforeEach(async function(){
        // clean the tables before each test run
        try {
            // clean the tables before each test run
            await db.none('TRUNCATE TABLE registration_number RESTART IDENTITY CASCADE;');
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    it ('Should be able to store user registration.', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CA 125-325',3);

        const checkingName = await database.displayingRegNums();
        const getObject = checkingName[0];
        assert.equal("CA 125-325", getObject.registration)
    })

    it ('Should be able to filter registration numbers from Cape Town.', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CA 125-325',3);
        await database.storingUserRegistration('CA 125-355',3);
        await database.storingUserRegistration('CJ 125-325',2);

        const checkingName = await database.getRegByTown("CA");
        assert.deepEqual([ { registration: 'CA 125-355' }, { registration: 'CA 125-325' } ]
        , checkingName)
    })

    it ('Should be able to filter registration numbers from Paarl.', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CJ 125-325',2);
        await database.storingUserRegistration('CJ 125-385',2);
        await database.storingUserRegistration('CA 125-325',3);

        const checkingName = await database.getRegByTown("CJ");
        assert.deepEqual([ { registration: 'CJ 125-325' }, { registration: 'CJ 125-385' } ]
        , checkingName)
    })


    it ('Should be able to filter registration numbers from Bellvill.', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CJ 125-325',2);
        await database.storingUserRegistration('CJ 125-355',2);
        await database.storingUserRegistration('CA 125-325',3);

        const checkingName = await database.getRegByTown("CJ");
        assert.deepEqual([ { registration: 'CJ 125-325' }, { registration: 'CJ 125-355' } ]
        , checkingName)
    })

    it ('Should be able to filter registrations numbers fom each town and their correct Amount.', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CJ 115-325',2);
        await database.storingUserRegistration('CJ 145-325',2);
        await database.storingUserRegistration('CJ 185-325',2);
        await database.storingUserRegistration('CJ 195-355',2);
        await database.storingUserRegistration('CJ 135-325',2);
        await database.storingUserRegistration('CA 125-355',3);
        await database.storingUserRegistration('CA 125-355',3);

        const checkingName = await database.getRegByTown("CJ");
        assert.equal(5, checkingName.length)
    })

    it ('Should be able to check user id by a City.', async function(){
        let database = factoryFunction(db);
        const checkingId = await database.gettingTownID('CA');
        assert.deepEqual(3, checkingId)
    })


    it ('Should be able to clear Registrations', async function(){
        let database = factoryFunction(db);
        await database.storingUserRegistration('CJ 115-325',2);
        await database.storingUserRegistration('CJ 145-325',2);
        await database.storingUserRegistration('CJ 185-325',2);
        await database.storingUserRegistration('CJ 195-355',2);
        await database.storingUserRegistration('CJ 135-325',2);
        await database.storingUserRegistration('CA 125-355',3);
        await database.storingUserRegistration('CA 125-355',3);
        await database.clearingReg()


        const clearingReg = await database.clearingReg();        
        
        assert.equal(null, clearingReg)
    })



    after(function(){
        db.$pool.end()
    })
})