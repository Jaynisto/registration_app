module.exports = function factoryFunction(db){
    async function storingUserRegistration(insertReg,id){
        const insertingUserReg = 'INSERT INTO registration_number(registration,town_id) VALUES ($1,$2);';
        await db.none(insertingUserReg, [insertReg,id])
    }

    async function displayingRegNums(){
        const registrationNums = "SELECT DISTINCT registration FROM registration_number;"
        const gettingRegFromTable = await db.any(registrationNums);
        return gettingRegFromTable
    }
    async function getRegByTown(town){
        let theTown = 0
        if(town == "CY"){
           theTown = 1
        }
        if(town == "CJ"){
           theTown = 2
        }
        if(town == "CA"){
           theTown = 3
        }
        const select = await db.manyOrNone('SELECT DISTINCT registration FROM registration_number WHERE town_id = $1;',[theTown])
        return select;
    }

    async function gettingTownID(reg){
        const townId = await db.one('SELECT id FROM my_towns WHERE tag = $1',[reg])
        return townId.id;
    }

    async function clearingReg(){
        const clearReg = await db.none('DELETE FROM registration_number;')
        return clearReg;
    }

    async function detectDupReg(regNumber){
        const findUser = 'SELECT count(*) from registration_number WHERE registration  = $1;';
        const result = await db.one(findUser, [regNumber]);
        return result.count;
    }

    return{
        storingUserRegistration,
        displayingRegNums,
        gettingTownID,
        getRegByTown,
        clearingReg,
        detectDupReg
    }
}



// async function detectDupReg(registration){
//     const selectingReg = await db.any('SELECT registration FROM registration_number WHERE registration = $1;'[registration])
//     return selectingReg.length >= 1 ? true : false;

// }