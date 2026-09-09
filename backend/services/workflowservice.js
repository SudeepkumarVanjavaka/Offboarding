export const getNextStage = (stages, currentOrder) => {
    return stages.find(stage => stage.order === currentOrder + 1);
};