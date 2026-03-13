"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = exports.createProject = void 0;
const DroneProject_1 = require("../models/DroneProject");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id, project_name, flight_date, pilot_id } = req.body;
        const project = yield DroneProject_1.DroneProject.create({
            farm_id,
            project_name,
            flight_date,
            pilot_id
        });
        res.status(201).json({ success: true, project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createProject = createProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id } = req.query;
        const whereClause = farm_id ? { farm_id } : {};
        const projects = yield DroneProject_1.DroneProject.findAll({ where: whereClause });
        res.json({ success: true, projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getProjects = getProjects;
