import { call, put } from "redux-saga/es/effects";

const RequestActionTypes = {
    COMPLETED: "@REQUEST/COMPLETED",
    PENDING: "@REQUEST/PENDING",
    STARTED: "@REQUEST/STARTED"
};

const isSuccessful = (result) => get(result, "data.status", false) && hasData(result);

/* Note: By default showIsLoading is false else dispatch { type: RequestActionTypes.PENDING } and completed
 * This ensures that the user sees a loading icon and understands that the app doing blocking work. */

const SHOW_IS_LOADING = true;

function* fetch(model: string, serviceCall: any, params ?: any, showIsLoading: boolean = false) : any {
    const modelNameUpper = model.toUpperCase();
    try {
        yield put( {type: `FETCH_${modelNameUpper}_START`, payload: params });
        if (!showIsLoading) {
            yield put({ type: RequestActionTypes.PENDING  });
        }
        const result = yield call(serviceCall, params);
        if (isSuccessful(result)) {
            yield put({type: `FETCH_${modelNameUpper}_SUCCESS`, payload: result.data.data});
        } else {
            console.log(`FETCH_${modelNameUpper}_ERROR`, "No record exists!");
            yield put({ type: `FETCH_${modelNameUpper}_ERROR`, payload: {error: `No fetch record exists for ${modelNameUpper}!`} });
        }
        return result;
    } catch (error) {
        console.error(error);
        yield put({ type: `FETCH_${modelNameUpper}_ERROR`, payload: {error: error.response.data } });
        return error;
    } finally {
        if (!showIsLoading) {
            yield put({type: RequestActionTypes.COMPLETED});
        }
    }
}

function* create(model: string, serviceCall: any, id, params ?: any, showIsLoading: boolean = false) : any {
    const modelNameUpper = model.toUpperCase();
    try {
        yield put( { type: `SAVE_NEW_${modelNameUpper}_START`, payload: { id, params } });
        if (!showIsLoading) {
            yield put({ type: RequestActionTypes.PENDING });
        }
        const result = yield call(serviceCall, id, params);
        if (isSuccessful(result)) {
            yield put({type: `SAVE_NEW_${modelNameUpper}_SUCCESS`, payload: result.data.data});
        } else {
            console.log(`SAVE_NEW_${modelNameUpper}_ERROR`, "No record exists!");
            yield put({ type: `SAVE_NEW_${modelNameUpper}_ERROR`, payload: {error: "No record exists!"} });
        }
        if (!showIsLoading) {
            yield put({type: RequestActionTypes.COMPLETED});
        }
        return result;
    } catch (error) {
        console.error(error);
        yield put({ type: `SAVE_NEW_${modelNameUpper}_ERROR`, payload: { error: error.response.data } });
        return error;
    } finally {
        if (!showIsLoading) {
            yield put({type: RequestActionTypes.COMPLETED});
        }
    }
}

function* update(model: string, serviceCall: any, id, params: any, showIsLoading: boolean = false) : any {
    const modelNameUpper = model.toUpperCase();
    try {
        yield put( {type: `SAVE_${modelNameUpper}_START`, payload: params});
        if (!showIsLoading) {
            yield put({ type: RequestActionTypes.PENDING });
        }
        const result = yield call(serviceCall, id, params);
        if (isSuccessful(result)) {
            yield put({type: `SAVE_${modelNameUpper}_SUCCESS`, payload: result.data.data });
        } else {
            console.log(`SAVE_${modelNameUpper}_ERROR`, "No record exists!");
            yield put({ type: `SAVE_${modelNameUpper}_ERROR`, payload: { error: "No record exists!" } });
        }
        return result;
    } catch (error) {
        console.error(error);
        yield put({ type: `SAVE_${modelNameUpper}_ERROR`, payload: { error: error.response.data } });
        return error;
    } finally {
        if (!showIsLoading) {
            yield put({type: RequestActionTypes.COMPLETED});
        }
    }
}

export { fetch, create, update, SHOW_IS_LOADING };

export default { fetch, create, update, SHOW_IS_LOADING };
