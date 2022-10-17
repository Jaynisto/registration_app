module.exports = function factoryFunction(db){
    async function storingUserRegistration(insertReg){
        const insertingUserReg = 'INSERT INTO registration_number(registration) VALUES ($1);';
        await db.none(insertingUserReg, [insertReg])
    }

    return{
        storingUserRegistration
    }
}