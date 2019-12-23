const express  = require('express');
const router   = express.Router();

const ControllerRegion = require('../../controller/ControllerLocalReg')

router.get('/provinsi',ControllerRegion.get_provinsi);
router.get('/kabupaten/:idProv',ControllerRegion.get_kabupaten);
router.get('/kecamatan/:idKab',ControllerRegion.get_kecamatan);
router.get('/desa/:idKec',ControllerRegion.get_desa);

module.exports = router;