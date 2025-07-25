import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm"

const client = new SSMClient({ region: 'us-east-1' });

export async function getParameters(path) {
    try {
        const input = {
            Path: path,
            Recursive: true,
            WithDecryption: true
        }
        const command = new GetParametersByPathCommand(input);
        const response = await client.send(command);

        response.Parameters.forEach(param => {
            const key = param.Name.replace(path, '').toUpperCase();
            process.env[key] = param.Value;
        });
    }
    catch (error) {
        console.error('Error fetching parameters:', error);
    }
}
