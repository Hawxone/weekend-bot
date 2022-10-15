import {SlashCommandBuilder} from "discord.js"

export const rolesCommand = new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('add a role')
    .addRoleOption((option)=>
    option
        .setName('newrole')
        .setDescription('Add new Role')
    )

export default rolesCommand.toJSON()
