module.exports = function factoryFunction(db){
    async function storingUserRegistration(insertReg,id){
        const insertingUserReg = 'INSERT INTO registration_number(registration,town_id) VALUES ($1,$2);';
        await db.none(insertingUserReg, [insertReg,id])
    }

    async function displayingRegNums(){
        const registrationNums = "SELECT registration FROM registration_number;"
        const gettingRegFromTable = await db.any(registrationNums);
        return gettingRegFromTable
    }
    async function getRegByTown(town){
        const theTown = []
        if(town == "CY"){
        theTown.push(1)
        }
        if(town == "CJ"){
           theTown.push(2)
        }
         if(town == "CA"){
           theTown.push(3)
        }
        const select = await db.manyOrNone('SELECT registration FROM registration_number WHERE town_id = $1;',[theTown])
        return select;
    }

    async function gettingTownID(reg){
        const townId = await db.one('SELECT id FROM my_towns WHERE tag = $1',[reg])
        return townId.id;
    }

    return{
        storingUserRegistration,
        displayingRegNums,
        gettingTownID,
        getRegByTown
    }
}