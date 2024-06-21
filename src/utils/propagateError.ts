import { Datapoint, PropagatedDatapoint } from "@/app/types";
 
function calculatePropagatedErrors(data: Datapoint[]): PropagatedDatapoint[] {
    const n = data.length;
    const propagatedErrors: PropagatedDatapoint[] = [];

    for (let i = 0; i < n; i++) {
        // Derivative approximation using central differences
        let dy_dx: number;
        if (i === 0) {
            // Forward difference for the first point
            dy_dx = (data[i + 1].dependentVariable - data[i].dependentVariable) / (data[i + 1].independentVariable - data[i].independentVariable);
        } else if (i === n - 1) {
            // Backward difference for the last point
            dy_dx = (data[i].dependentVariable - data[i - 1].dependentVariable) / (data[i].independentVariable - data[i - 1].independentVariable);
        } else {
            // Central difference for interior points
            dy_dx = (data[i + 1].dependentVariable - data[i - 1].dependentVariable) / (data[i + 1].independentVariable - data[i - 1].independentVariable);
        }

        // Propagated error calculation
        const propagatedErry = Math.sqrt(
            Math.pow(dy_dx * data[i].independentVariableError, 2) + Math.pow(data[i].dependentVariableError, 2)
        );

        // Store result
        propagatedErrors.push({
            independentVariable: data[i].independentVariable,
            dependentVariable: data[i].dependentVariable,
            propagatedDependentVariableError: propagatedErry
        });
    }

    return propagatedErrors;
}

export default calculatePropagatedErrors;
